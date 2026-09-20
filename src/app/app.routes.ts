  import { Routes } from '@angular/router';
  import { TaskListComponent } from './components/task-list/task-list.component';
  import { TaskCreateComponent } from './components/task-create/task-create.component';

  export const routes: Routes = [
    { path: '', component: TaskListComponent },
    { path: 'create', component: TaskCreateComponent }
  ];