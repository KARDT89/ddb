

const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "deepseek-r1:latest",
      messages: [{ role: "user", content: "Hello how are you" }],
      stream: false // test without streaming first
    })
  });
  
  const data = await response.json();
  console.log(data);
  