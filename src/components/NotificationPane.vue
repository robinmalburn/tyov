<template>
    <transition
        enter-active-class="transition-all duration-400 ease-out"
        leave-active-class="transition-all duration-400 ease-in"
        enter-class="opacity-0 scale-40"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-40"
    >
        <div :class="classes" v-show="visible">
            <div class="flex-1">
                {{ message }}
            </div>
            <RemoveCrossComponent class="flex-initial" @remove="hide"/>
        </div>
    </transition>
</template>

<script>
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import { mapMutations, mapState } from 'vuex';


const TYPES = {
    default: {
        'border-indigo-400': true,
        'bg-indigo-100': true,
        'text-indigo-600': true,
    },
    danger: {
        'border-red-600': true,
        'bg-red-200': true,
        'text-red-800': true,
    },
    warning: {
        'border-yellow-400': true,
        'bg-yellow-100': true,
        'text-yellow-600': true,
    }
};

var timer = null;

export default {
  name: 'NotificationPane',
  components: {
      RemoveCrossComponent,
  },
  data() { 
    return {
        timeout: 5000,
    }
  },
  computed: {
      ...mapState('notifications', ['visible', 'message', 'type']),
      classes() {
          return {
              'sticky': true,
              'inset-6': true,
              'border': true,
              'rounded': true,
              'p-2': true,
              'flex': true,
              ...TYPES[this.type],
          }
      }
  },
  methods: {
      ...mapMutations('notifications', ['hide']),
  },
  watch: {
      visible(value) {
          clearTimeout(timer);

          if (value) {
            timer = setTimeout(() => {
                this.hide();
            }, this.timeout);
          }
      }
  }
}
</script>