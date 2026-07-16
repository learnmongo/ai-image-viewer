const SPINNER_FRAMES = ['|', '/', '-', '\\'];

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
};

/**
 * Runs an async function while displaying a single-line spinner with elapsed time.
 * Designed for CLI use; dependency-free.
 *
 * @template T
 * @param {string} label
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export const runWithProgress = async (label, fn) => {
  const start = Date.now();
  let i = 0;

  const render = () => {
    const frame = SPINNER_FRAMES[i % SPINNER_FRAMES.length];
    const elapsed = formatDuration(Date.now() - start);
    process.stdout.write(`\r${frame} ${label} (${elapsed})`);
    i += 1;
  };

  // initial render + interval updates
  render();
  const timer = setInterval(render, 250);

  try {
    const result = await fn();
    clearInterval(timer);
    const elapsed = formatDuration(Date.now() - start);
    process.stdout.write(`\r✓ ${label} (${elapsed})\n`);
    return result;
  } catch (err) {
    clearInterval(timer);
    const elapsed = formatDuration(Date.now() - start);
    process.stdout.write(`\r✗ ${label} (${elapsed})\n`);
    throw err;
  }
};
