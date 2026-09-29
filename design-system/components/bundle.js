/* @ds-bundle: {"format":4,"namespace":"TelematicsStack","components":[{"name":"Button"},{"name":"Eyebrow"},{"name":"StatBlock"},{"name":"FeatureCard"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  function Button(props) {
    var variant = props.variant || 'primary';
    var size = props.size || 'md';
    var className = cx('ts-btn', 'ts-btn--' + variant, size === 'sm' && 'ts-btn--sm', props.className);
    if (props.href) {
      return h('a', { className: className, href: props.href, 'aria-disabled': props.disabled ? 'true' : undefined, onClick: props.onClick }, props.children);
    }
    return h('button', { className: className, type: props.type || 'button', disabled: props.disabled, onClick: props.onClick }, props.children);
  }

  function Eyebrow(props) {
    var on = props.on || 'ground';
    var className = cx('ts-eyebrow', on === 'block' && 'ts-eyebrow--on-block', on === 'volt' && 'ts-eyebrow--on-volt', props.className);
    return h(props.as || 'span', { className: className }, props.children);
  }

  function StatBlock(props) {
    var tone = props.tone || 'outline';
    return h('div', { className: cx('ts-stat', 'ts-stat--' + tone, props.className) },
      h('p', { className: 'ts-stat__value' }, props.value),
      h('p', { className: 'ts-stat__label' }, props.label)
    );
  }

  function FeatureCard(props) {
    var tone = props.tone || 'surface';
    return h('div', { className: cx('ts-card', tone === 'block' && 'ts-card--block', props.className) },
      props.icon ? h('div', { className: 'ts-card__icon', 'aria-hidden': 'true' }, props.icon) : null,
      props.eyebrow ? h(Eyebrow, { on: tone === 'block' ? 'block' : 'ground' }, props.eyebrow) : null,
      h('h3', { className: 'ts-card__title' }, props.title),
      props.children ? h('p', { className: 'ts-card__body' }, props.children) : null,
      props.spec ? h('p', { className: 'ts-card__spec' }, props.spec) : null
    );
  }

  window.TelematicsStack = { Button: Button, Eyebrow: Eyebrow, StatBlock: StatBlock, FeatureCard: FeatureCard };
})();
