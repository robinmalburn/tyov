import uuid from 'Libs/uuid'

export default {
  description: 'Adds ID to resources and diaries.',
  requiredSignature: 1,
  migrate(data) {
    data.resources.forEach((resource) => {
      if (!resource.id) {
        resource.id = uuid('resource')
      }
    })

    data.diaries.forEach((diary) => {
      if (!diary.id) {
        diary.id = uuid('diary')
      }
    })

    return data
  },
}
