  import { Routes } from '@angular/router';
  import { TaskListComponent } from './components/task-list/task-list.component';
  import { TaskCreateComponent } from './components/task-create/task-create.component';
  import { TaskEditComponent } from './components/task-edit/task-edit.component';
  import { LoginComponent } from './components/login/login.component';
  import { authGuard } from './guards/auth.guard';

  export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: TaskListComponent, canActivate: [authGuard] },
    { path: 'create', component: TaskCreateComponent, canActivate: [authGuard] },
    { path: 'edit/:id', component: TaskEditComponent, canActivate: [authGuard] }
  ];