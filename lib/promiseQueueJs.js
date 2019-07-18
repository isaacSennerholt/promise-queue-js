module.exports = (
  preloadedState = null,
  { watch = false, interval = 0 } = {}
) => {
  /**
   * IDEA:
   * Task throws ->
   * Count the number of times task failed ->
   * Discard task if it failed X times, otherwise ->
   * Place task last in queue
   */

  let isProcessing = false
  let currentState = preloadedState || []

  function getState() {
    return currentState.slice(0)
  }

  function addTask(fn, args = []) {
    if (typeof fn !== 'function') {
      throw new Error('Expected the first argument to be a function.')
    }
    const task = () => fn(...args)
    currentState = currentState.concat([task])
    if (!isProcessing && watch) processTasks()
    return task
  }

  function nextTask() {
    const task = currentState[0]
    currentState = currentState.slice(1)
    return task
  }

  function executeTask(task) {
    if (typeof task !== 'function') {
      throw new Error('Failed to execute task. Expected task to be a function.')
    }
    const delay = milliseconds =>
      new Promise(resolve => setTimeout(resolve, milliseconds))
    const execute = interval
      ? delay(interval).then(task)
      : Promise.resolve(task())
    return execute
  }

  function processTasks() {
    if (!currentState.length) {
      isProcessing = false
      return Promise.resolve(currentState)
    }
    isProcessing = true
    const task = nextTask()
    return executeTask(task).then(() => processTasks(), () => processTasks())
  }

  return {
    getState,
    addTask,
    nextTask,
    executeTask,
    processTasks
  }
}
