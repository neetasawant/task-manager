export async function GET(request, { params }) {
  const { taskId } = params;
  
  const task = {
    id: taskId,
    title: "Example Task",
    description: "Task description",
  };

  if (task) {
    return new Response(JSON.stringify(task), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
    });
  }
}

export async function PUT(request, { params }) {
  const { taskId } = params;
  const taskData = await request.json();

  const updatedTask = { id: taskId, ...taskData };

  return new Response(JSON.stringify(updatedTask), { status: 200 });
}
