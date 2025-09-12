export class Task {
    title: string;
    description: string;
    created_by: any;
    assigned_to: any;
    reviewer: any;
    due_date: string;
    start_date: string;
    completed_at: string;
    updated_at: string;
    state: string;
    priority: string;
    tags: string;
    collaboraters: any[];
    is_completed: boolean;
    blocked_by: any;
    customer: any;
    comments: any[];

    constructor(task?: any) {
        this.title = task ? task.title : '';
        this.description = task ? task.description : '';
        this.created_by = task ? task.created_by : {};
        this.assigned_to = task ? task.assigned_to : {};
        this.reviewer = task ? task.reviewer : {};
        this.due_date = task ? task.due_date : '';
        this.start_date = task ? task.start_date : '';
        this.completed_at = task ? task.completed_at : '';
        this.updated_at = task ? task.updated_at : '';
        this.state = task ? task.state : '';
        this.priority = task ? task.priority : ''
        this.tags = task ? task.tags : '';
        this.collaboraters = task ? task.collaboraters : [];
        this.is_completed = task ? task.is_completed : false;
        this.blocked_by = task ? task.blocked_by : {};
        this.customer = task ? task.customer : {};
        this.comments = task ? task.comments : [];
    }
}