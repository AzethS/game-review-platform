import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ICompany, Id } from '@game-platform/shared/api';
import { CreateCompanyDto, UpdateCompanyDto } from '@game-platform/backend/dto';

@Injectable()
export class CompanyService {
  private readonly TAG = 'CompanyService';

  constructor(@InjectModel('Company') private readonly companyModel: Model<ICompany>) {}

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
      const updatedCompany = await this.companyModel
        .findByIdAndUpdate(id, updateCompanyDto, { new: true })
        .populate('gamesCreated')
        .exec();
      if (!updatedCompany) {
        throw new NotFoundException(`Company with ID ${id} not found`);
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
      const result = await this.companyModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof Error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Add a game to the company's gamesCreated
  async addGame(companyId: string, gameId: string): Promise<ICompany> {
    try {
      const company = await this.companyModel.findById(companyId).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }

      if (!company.gamesCreated.includes(gameId)) {
        company.gamesCreated.push(gameId);
        await company.save();
      }
      return this.toICompany(company);
    } catch (error) {
      if (error instanceof Error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException('An unexpected error occurred');
    }
  }

  // Remove a game from the company's gamesCreated
  async removeGame(companyId: string, gameId: string): Promise<ICompany> {
    try {
      const company = await this.companyModel.findById(companyId).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }

      company.gamesCreated = company.gamesCreated.filter((id) => id.toString() !== gameId);
      await company.save();
      return this.toICompany(company);
    } catch (error) {
      if (error instanceof Error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException('An unexpected error occurred');
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
