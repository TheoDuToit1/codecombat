  // Update the executeCode function to handle empty code
  const executeCode = (code: string) => {
    if (isRunning) return;
    if (!code || code.trim() === '') {
      setExecutionLogs(['<span class="zoom-effect flashing-orange-gradient">Code first!</span>']);
      setTimeout(() => { setExecutionLogs([]); }, 2000);
      setCurrentExecutingLine(-1);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setExecutionLogs([]);
    // Only run new lines since lastExecutedLine
    const allLines = code.split('\n');
    const lines = allLines.filter(line => line.trim() && !line.trim().startsWith('//'));
    let startLine = lastExecutedLine;
    let currentLineIndex = startLine;
    
    // Global timeout fail-safe
    setTimeout(() => {
      if (isRunning) {
        console.log('setIsRunning: false (global timeout fail-safe)');
        setIsRunning(false);
      }
    }, 10000); // 10 seconds