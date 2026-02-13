export default {
  description: 'Decouples the nested state of memories, events and diaries.',
  requiredSignature: 2,
  migrate(data) {
    const memoryMap = {}

    data.diaries.forEach((diary) => {
      diary.memories.forEach((memory) => {
        if (memoryMap[memory.id] === undefined) {
          memoryMap[memory.id] = []
        }

        memoryMap[memory.id].push(diary)
      })

      delete diary.memories
    })

    if (!data.events) {
      data.events = []
    }

    let len = data.events

    data.memories.forEach((memory) => {
      if (memory.diarised !== undefined) {
        delete memory.diarised
      }

      if (memory.diary === undefined) {
        memory.diary = ''
      }

      if (memoryMap[memory.id] !== undefined) {
        let diary = memoryMap[memory.id][0]

        if (memoryMap[memory.id].length > 1 && diary === false) {
          memoryMap[memory.id].some((d) => {
            if (d.lost === false) {
              diary = d
            }
          })
        }

        memory.diary = diary.id
      }

      memory.events.forEach((event) => (event.memory = memory.id))
      data.events.splice(len, 0, ...memory.events)
      len += memory.events.length
      delete memory.events
    })

    return data
  },
}
