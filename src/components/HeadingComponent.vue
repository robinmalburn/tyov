<script>

const HEADING_STYLES = [
    {
        'text-3xl': true,
    },
    {
        'text-2xl': true,
    },
    {
        'text-xl': true,
    },
    {
        'text-base': true,
    },
    {
        'text-sm': true,
    },
    {
        'text-sm': true,
    },
];

export default {
  name: 'HeadingComponent',
  functional: true,
  props: {
      level: {
          type: String,
          default: '1',
          validator: (level) => ['1', '2', '3', '4', '5', '6'].includes(level),
      }
  },
  render: function(createElement, context) {
      const extraClasses = context.data.class || {};

      if (context.data.staticClass) {
          extraClasses[context.data.staticClass] = true;
      }

      return createElement(
          `h${context.props.level}`,
          {
              ...context.data,
              class: {
                'font-semibold': true,
                'leading-loose' : true, 
                'tracking-widest': true,
                'text-indigo-800': true,
                ...extraClasses,
                ...HEADING_STYLES[context.props.level-1]
              }
          },
          context.children
        );
  }
}
</script>