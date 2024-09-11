import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { Task, TaskStatus, TaskService } from './task.service';
import { Asset } from './asset.service';
import { User, UserService } from './user.service';

describe('userService', () => {
  let httpMock: HttpTestingController;
  let service: UserService;

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Tom',
      avatar: 'picture',
    },
    {
      id: '2',
      name: 'John',
      avatar: 'picture',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('can create userService', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    service.getAllUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  it('should get user by id', () => {
    const mockUser = mockUsers[0];

    service.getUserById(mockUser.id).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/users/${mockUser.id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });

  it('should get users by ids', () => {
    service
      .getUsersByIds(mockUsers.map((user) => user.id))
      .subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });
});
