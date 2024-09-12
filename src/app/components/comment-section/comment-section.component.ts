import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs';

import { TagInputComponent } from '../tag-input/tag-input.component'; // Custom tag input component
import { CommentService, TaskComment } from '../../services/comment.service'; // Service to handle comment operations
import { AuthService } from '../../services/auth.service'; // Service to manage authentication
import { User, UserService } from '../../services/user.service'; // User and user-related services
import { Task } from '../../services/task.service'; // Task service

@Component({
  selector: 'app-comment-section', // HTML tag to use this component
  standalone: true, // Component is standalone (no need for module declaration)
  imports: [NgFor, NgIf, FormsModule, TagInputComponent], // Imported modules and components used in this component
  templateUrl: './comment-section.component.html', // Template for the component
  styleUrls: ['./comment-section.component.css'], // CSS for the component
})
export class CommentSectionComponent {
  @Input() taskId!: Task['id']; // Receives task ID as input to load related comments

  authUser: User | undefined; // Holds the authenticated user
  users: User[] = []; // List of all users (used for tagging)
  comments: TaskComment[] = []; // List of comments on the task
  newCommentMessage: string = ''; // New comment being typed by the user
  taggedUserIds: User['id'][] = []; // IDs of users tagged in the comment

  constructor(
    private userService: UserService, // Injects UserService to fetch users
    private commentService: CommentService, // Injects CommentService to fetch and post comments
    private authService: AuthService // Injects AuthService to get the authenticated user
  ) {}

  // Lifecycle hook that runs once the component is initialized
  ngOnInit() {
    // Fetch comments for the task and load them when the component initializes
    this.getCommentsByTaskId(this.taskId);
    // Fetch all users (for tagging)
    this.getAllUsers();

    // Subscribe to the authUser$ observable to keep track of the logged-in user
    this.authService.authUser$.subscribe(
      (authUser) => (this.authUser = authUser)
    );
  }

  // Fetches all users for the tagging functionality
  getAllUsers() {
    this.userService
      .getAllUsers()
      .subscribe((users: User[]) => (this.users = users));
  }

  // Fetches all comments related to a specific task ID
  getCommentsByTaskId(taskId: string) {
    this.commentService
      .getAllCommentsByTaskId(taskId)
      .pipe(
        // Use switchMap to chain the fetching of users after the comments
        switchMap((comments) => {
          this.comments = comments;
          // Fetch users based on the user IDs in the comments
          return this.userService
            .getUsersByIds(comments.map((c) => c.userId))
            .pipe(map((users) => users));
        }),
        // Map the user data to each comment so the UI can display the user info
        map((users) => {
          this.comments = this.comments.map((c) => ({
            ...c,
            user: users.find((u) => u.id === c.userId),
          }));
        })
      )
      .subscribe(); // Execute the observable stream
  }

  // Handles posting a new comment with the current authenticated user ID
  postCommentByUserId(message: string) {
    this.commentService
      .postCommentByUserId(
        message, // Message content
        this.authUser!.id, // Authenticated user ID
        this.taskId, // Task ID associated with the comment
        this.taggedUserIds // List of tagged users
      )
      .subscribe((comment: TaskComment) => {
        // Add the new comment to the current list of comments and associate the user
        this.comments = [
          ...this.comments,
          {
            ...comment,
            user: this.users.find((u) => u.id === comment.userId),
          },
        ];
      });
  }

  // Callback function for when tagged user IDs change (from TagInputComponent)
  onTaggedUserIdsChange(taggedUserIds: User['id'][]): void {
    this.taggedUserIds = taggedUserIds;
  }

  // Submits a new comment after validation
  commentSubmit() {
    if (this.newCommentMessage.trim()) {
      // Post the new comment if the message is not empty
      this.postCommentByUserId(this.newCommentMessage);

      // Clear the message and tagged user list after submission
      this.newCommentMessage = '';
      this.taggedUserIds = [];
    }
  }

  // TODO: Move to a reusable pipe
  // Formats the comment message, replacing tagged users with a special styled span
  formatCommentForTags(comment: TaskComment['message']) {
    const getTagsRegex = /@(\w+[\w-]*)(?=[\s.!?]|$)/g; // Regex to match @user mentions
    return comment.replace(
      getTagsRegex,
      '<span class="bg-yellow-100 px-1 rounded-sm font-semibold">@$1</span>'
    );
  }
}
