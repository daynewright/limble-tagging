import { Routes } from '@angular/router';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ROUTES } from './routes.constants';

export const routes: Routes = [
  { path: ROUTES.LOGIN, component: LoginComponent },
  {
    path: ROUTES.ASSETS,
    component: AssetListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ROUTES.TASKLIST,
    component: TaskListComponent,
    canActivate: [AuthGuard],
  },
  { path: ROUTES.WILDCARD, redirectTo: ROUTES.ASSETS },
];
