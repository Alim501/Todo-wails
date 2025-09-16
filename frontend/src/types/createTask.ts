import { Priority } from "./priority"

export interface CreateTaskRequest {
  title: string
  description: string
  priority: Priority
  due_at: Date | null
}
