import { experimental_workflow } from 'eve/tools';

// Workflow orchestration can call at most the nine declared role agents per run.
export default experimental_workflow({ maxSubagents: 9 });
