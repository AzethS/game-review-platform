import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ICompany, Id, IGame } from '@game-platform/shared/api';
import { CreateCompanyDto, UpdateCompanyDto } from '@game-platform/backend/dto';

@Injectable()
export class CompanyService {
  private readonly TAG = 'CompanyService';

  constructor(
    @InjectModel('Company') private readonly companyModel: Model<ICompany>,
    @InjectModel('Game') private readonly gameModel: Model<IGame>
  ) {}

  // Create a new company
  async create(createCompanyDto: CreateCompanyDto): Promise<string> {
    const newCompany = new this.companyModel(createCompanyDto);
    const company = await newCompany.save();
    return company.id as string;
  }

  // Retrieve all companies
  async getAll(): Promise<ICompany[]> {
    try {
      Logger.log('getAll', this.TAG);
      const companies = await this.companyModel.find().populate('gamesCreated').exec();
      return companies.map((company) => this.toICompany(company));
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Retrieve a single company by ID
  async getOne(id: string): Promise<ICompany> {
    try {
      Logger.log(`getOne(${id})`, this.TAG);
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
      }
      const company = await this.companyModel.findById(id).populate('gamesCreated').exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return this.toICompany(company);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Update a company
  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<string> {
    try {
      const company = await this.companyModel.findById(id).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      const updatedCompany = await this.companyModel
        .findByIdAndUpdate(id, updateCompanyDto, { new: true })
        .exec();

      if (!updatedCompany) {
        throw new NotFoundException(`Company with ID ${id} not found during update`);
      }

      // Update references for gamesCreated
      if (updateCompanyDto.gamesCreated !== undefined) {
        await this.updateCompanyReferences(
          id,
          (company.gamesCreated || []).map(g => typeof g === 'string' ? g : g.id),
          updateCompanyDto.gamesCreated.map(g => typeof g === 'string' ? g : g.id),
          this.gameModel,
          'createdBy'
        );
        
      }

      return updatedCompany.id as string;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Delete a company
  async delete(id: string): Promise<void> {
    try {
      const company = await this.companyModel.findById(id).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Remove references to this company from related games
      await this.gameModel.updateMany(
        { _id: { $in: company.gamesCreated } },
        { $unset: { createdBy: '' } }
      );

      await this.companyModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Add a game to the company's gamesCreated
// company.service.ts

async addGame(companyId: string, gameId: string): Promise<ICompany> {
  const company = await this.companyModel.findById(companyId).exec();
  if (!company) throw new NotFoundException(`Company with ID ${companyId} not found`);

  const existingIds = (company.gamesCreated || []).map(g =>
    typeof g === 'string' ? g : g.id
  );

  const gameDoc = await this.gameModel.findById(gameId).exec();
  if (gameDoc && !existingIds.includes(gameId)) {
    company.gamesCreated = [...(company.gamesCreated || []), gameDoc];
    await company.save();
  }
  

  return this.toICompany(await company.populate('gamesCreated'));
}

async removeGame(companyId: string, gameId: string): Promise<ICompany> {
  const company = await this.companyModel.findById(companyId).exec();
  if (!company) throw new NotFoundException(`Company with ID ${companyId} not found`);

  company.gamesCreated = (company.gamesCreated || []).filter(g =>
    (typeof g === 'string' ? g : g.id) !== gameId
  );
  await company.save();

  await this.gameModel.findByIdAndUpdate(gameId, { $unset: { createdBy: '' } });

  return this.toICompany(await company.populate('gamesCreated'));
}


  // Helper method to update company references
  private async updateCompanyReferences(
    companyId: Id,
    currentRefs: Id[],
    newRefs: Id[],
    model: Model<any>,
    fieldName: string
  ): Promise<void> {
    // Remove old references
    const toRemove = currentRefs.filter((id) => !newRefs.includes(id.toString()));
    if (toRemove.length > 0) {
      await model.updateMany(
        { _id: { $in: toRemove } },
        { $unset: { [fieldName]: '' } }
      );
    }

    // Add new references
    const toAdd = newRefs.filter((id) => !currentRefs.includes(id.toString()));
    if (toAdd.length > 0) {
      await model.updateMany(
        { _id: { $in: toAdd } },
        { [fieldName]: companyId }
      );
    }
  }

  // Helper method to transform company document to ICompany
  private toICompany(company: any): ICompany {
    const companyObject = company.toObject();
    companyObject.id = companyObject._id?.toHexString();
    delete companyObject._id;
    return companyObject as ICompany;
  }
}
