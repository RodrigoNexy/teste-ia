import { UserService } from '../../services/user.service.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários ordenados por data de criação', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@test.com' },
        { id: '2', name: 'User 2', email: 'user2@test.com' },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const mockUser = { id: '1', name: 'User 1', email: 'user1@test.com' };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const createData = {
        name: 'Novo Usuário',
        email: 'novo@test.com',
      };

      const createdUser = { id: '1', ...createData };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await userService.create(createData);

      expect(result).toEqual(createdUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updateData = { name: 'Usuário Atualizado' };
      const updatedUser = { id: '1', name: 'Usuário Atualizado', email: 'user@test.com' };

      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('deve deletar um usuário existente', async () => {
      mockPrisma.user.delete.mockResolvedValue({ id: '1' });

      const result = await userService.delete('1');

      expect(result).toBe(true);
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar false se usuário não existir', async () => {
      const error = new Error('Not found');
      (error as any).code = 'P2025';
      mockPrisma.user.delete.mockRejectedValue(error);

      const result = await userService.delete('1');

      expect(result).toBe(false);
    });

    it('deve lançar erro se não for erro P2025', async () => {
      const error = new Error('Database error');
      mockPrisma.user.delete.mockRejectedValue(error);

      await expect(userService.delete('1')).rejects.toThrow('Database error');
    });
  });
});


