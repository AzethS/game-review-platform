import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ICompany } from '@game-platform/shared/api';
import { CreateCompanyDto, UpdateCompanyDto } from '@game-platform/backend/dto';
import { CompanyService } from './company.service';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Get all companies
   * GET /companies
   */
  @Get()
  async getAll(): Promise<ICompany[]> {
    return await this.companyService.getAll();
  }

  /**
   * Get a single company by ID
   * GET /companies/:id
   */
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ICompany> {
    return await this.companyService.getOne(id);
  }

  /**
   * Create a new company
   * POST /companies
   */
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const generatedId = await this.companyService.create(createCompanyDto);
    return { id: generatedId };
  }

  /**
   * Update an existing company
   * PUT /companies/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, updateCompanyDto);
  }

  /**
   * Delete a company
   * DELETE /companies/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.companyService.delete(id);
  }

  /**
   * Add a game to the company's gamesCreated
   * POST /companies/:companyId/games/:gameId
   */
  @Post(':companyId/games/:gameId')
  async addGame(
    @Param('companyId') companyId: string,
    @Param('gameId') gameId: string,
  ) {
    return await this.companyService.addGame(companyId, gameId);
  }

  /**
   * Remove a game from the company's gamesCreated
   * DELETE /companies/:companyId/games/:gameId
   */
  @Delete(':companyId/games/:gameId')
  async removeGame(
    @Param('companyId') companyId: string,
    @Param('gameId') gameId: string,
  ) {
    return await this.companyService.removeGame(companyId, gameId);
  }
}
