import { Routes } from '@angular/router';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetListComponent },
  { path: 'assets/:assetId/tasks', component: TaskListComponent },
  { path: '**', redirectTo: '/assets' },
];
