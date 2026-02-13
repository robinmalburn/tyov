import uuid from 'Libs/uuid'

export default {
  description: 'Adds ID to skills.',
  requiredSignature: 1,
  migrate(data) {
    data.skills.forEach((skill) => {
      if (!skill.id) {
        skill.id = uuid('skill')
      }
    })

    return data
  },
}
