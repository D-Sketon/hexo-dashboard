import React, { useState } from 'react';
import api from '../api';

function Deploy() {
  const [state, setState] = useState({
    stdout: '',
    stderr: '',
    error: null,
    message: '',
    status: 'initial',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { message } = state;
    setState({
      message: '',
      error: null,
      stdout: '',
      stderr: '',
      status: 'loading',
    });

    try {
      const result = await api.deploy(message);
      setState((prevState) => ({
        ...prevState,
        status: result.error ? 'error' : 'success',
        error: result.error,
        stdout: result.stdout && result.stdout.trim(),
        stderr: result.stderr && result.stderr.trim(),
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        status: 'error',
        error: error.message,
      }));
    }
  };

  let body;
  if (state.error) {
    body = <h4>Error: {state.error}</h4>;
  } else if (state.status === 'loading') {
    body = <h4>Loading...</h4>;
  } else if (state.status === 'success') {
    body = (
      <div>
        <h4>Std Output</h4>
        <pre>{state.stdout}</pre>
        <h4>Std Error</h4>
        <pre>{state.stderr}</pre>
      </div>
    );
  }

  return (
    <div className="deploy" style={{ whiteSpace: 'nowrap' }}>
      <p>Type a message here and hit `deploy` to run your deploy script.</p>
      <form className="deploy_form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="deploy_message"
          value={state.message}
          placeholder="Deploy/commit message"
          onChange={(e) => setState({ ...state, message: e.target.value })}
        />
        <input type="submit" value="Deploy" />
      </form>
      {body}
    </div>
  );
}

export default Deploy;
