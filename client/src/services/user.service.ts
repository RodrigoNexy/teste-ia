import axios from 'axios';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

const API_BASE_URL = '/api/users';

export class UserService {
  async getAll(): Promise<User[]> {
    const response = await axios.get<User[]>(API_BASE_URL);
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/${id}`);
    return response.data;
  }

  async create(data: CreateUserDto): Promise<User> {
    const response = await axios.post<User>(API_BASE_URL, data);
    return response.data;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await axios.put<User>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }
}

