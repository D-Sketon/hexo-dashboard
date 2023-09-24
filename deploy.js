import { spawn } from 'child_process';

const once = (fn) => {
  let called = false;
  return (...args) => {
    if (called) {
      return;
    }
    called = true;
    fn(...args);
  };
}

export default function executeCommand(command, message, done) {
  done = once(done);
  const proc = spawn(command, [message], { detached: true });
  let stdout = '';
  let stderr = '';

  proc.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  proc.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  proc.on('error', (err) => {
    done(err, { stdout, stderr });
  });

  proc.on('close', () => {
    done(null, { stdout, stderr });
  });
}
