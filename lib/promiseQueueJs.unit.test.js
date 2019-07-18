const promiseQueue = require('./promiseQueueJs.js')

describe('promiseQueue', () => {
  test('create queue', () => {
    const queue = promiseQueue()
    const hasMethods = [
      'getState',
      'addTask',
      'nextTask',
      'processTasks'
    ].every(method => {
      return Object.keys(queue).includes(method)
    })
    expect(hasMethods).toBeTruthy()
  })

  test('get current state', () => {
    const queue = promiseQueue()
    expect(queue.getState()).toEqual([])
  })

  test('add task to queue', () => {
    const fn = payload => Promise.resolve(payload)
    const queue = promiseQueue()
    const state = queue.addTask(fn, ['batMan'])
    expect(() => typeof state[0] === 'function').toBeTruthy()
  })

  test('get next task', () => {
    const fn = payload => Promise.resolve(payload)
    const queue = promiseQueue([() => fn('batMan')])
    const next = queue.nextTask()
    expect(() => typeof next === 'function').toBeTruthy()
  })

  test('execute invalid task', () => {
    const queue = promiseQueue()
    const task = null
    expect(() => queue.executeTask(task)).toThrow()
  })

  test('execute task', () => {
    const fn = payload => Promise.resolve(payload)
    const queue = promiseQueue()
    const task = () => fn('batMan')
    const finishedTask = queue.executeTask(task)
    expect(finishedTask).resolves.toBe('batMan')
  })

  test('process tasks in queue', () => {
    const fn = payload => Promise.resolve(payload)
    const queue = promiseQueue([() => fn('batMan'), () => fn('robin')])
    expect(queue.processTasks()).resolves.toHaveLength(0)
  })
})
