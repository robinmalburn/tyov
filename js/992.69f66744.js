"use strict";(self["webpackChunktyov"]=self["webpackChunktyov"]||[]).push([[992],{5992:function(e,i,t){t.r(i);t(7658);i["default"]={description:"Decouples the nested state of memories, events and diaries.",requiredSignature:2,migrate(e){const i={};e.diaries.forEach((e=>{e.memories.forEach((t=>{void 0===i[t.id]&&(i[t.id]=[]),i[t.id].push(e)})),delete e.memories})),e.events||(e.events=[]);let t=e.events;return e.memories.forEach((s=>{if(void 0!==s.diarised&&delete s.diarised,void 0===s.diary&&(s.diary=""),void 0!==i[s.id]){let e=i[s.id][0];i[s.id].length>1&&!1===e&&i[s.id].some((i=>{!1===i.lost&&(e=i)})),s.diary=e.id}s.events.forEach((e=>e.memory=s.id)),e.events.splice(t,0,...s.events),t+=s.events.length,delete s.events})),e}}}}]);
//# sourceMappingURL=992.69f66744.js.map