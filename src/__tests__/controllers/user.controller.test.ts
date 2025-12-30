import { Request, Response } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { UserService } from '../../services/user.service.js';

jest.mock('../../services/user.service.js', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    (UserService as jest.Mock).mockImplementation(() => mockUserService);
    controller = new UserController();

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [{ id: '1', name: 'User 1' }];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      await controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('create', () => {
    it('deve criar um usuário com dados válidos', async () => {
      const createData = { name: 'Novo User', email: 'user@test.com' };
      const createdUser = { id: '1', ...createData };

      mockRequest.body = createData;
      mockUserService.create.mockResolvedValue(createdUser);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.create).toHaveBeenCalledWith(createData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
    });

    it('deve retornar 400 se campos obrigatórios estiverem faltando', async () => {
      mockRequest.body = { name: 'User' }; // falta email

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Name and email are required',
      });
    });

    it('deve retornar 409 se email já existir', async () => {
      mockRequest.body = { name: 'User', email: 'existing@test.com' };
      const error = new Error('Duplicate');
      (error as any).code = 'P2002';
      mockUserService.create.mockRejectedValue(error);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
  });
});

