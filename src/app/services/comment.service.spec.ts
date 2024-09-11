import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CommentService, TaskComment } from './comment.service';
import { Task, TaskStatus } from './task.service';
import { environment } from '../../environments/environment';

describe('commentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: '1',
    name: 'Get an oil change',
    status: TaskStatus.Ready,
    commentIds: ['1', '3'],
  };

  const mockComments: TaskComment[] = [
    {
      id: '1',
      userId: '3',
      message: 'This is a test comment.',
    },
    {
      id: '2',
      userId: '2',
      message: 'This is another comment.',
    },
    {
      id: '3',
      userId: '1',
      message: 'I will do this tomorrow.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('can create commentService', () => {
    expect(service).toBeTruthy();
  });

  it('should get all comments by task id', () => {
    const mockTaskComments = mockComments.filter((c) =>
      mockTask.commentIds?.includes(c.id)
    );

    service.getAllCommentsByTaskId(mockTask.id).subscribe((comments) => {
      expect(comments).toEqual(mockTaskComments);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/comments?taskId=${mockTask.id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockTaskComments);
  });

  it('should get a comment by comment id', () => {
    const mockComment = mockComments[0];

    service.getCommentById(mockComment.id).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/comments/${mockComment.id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockComment);
  });

  it('should create a new comment', () => {
    const newComment: TaskComment = {
      id: '4',
      userId: '1',
      message: 'This is a NEW comment',
    };

    service
      .postCommentByUserId(newComment.message, newComment.userId, '1')
      .subscribe((respComment) => {
        expect(respComment).toEqual(newComment);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/comments`);
    expect(req.request.method).toEqual('POST');

    req.flush(newComment);
  });
});
