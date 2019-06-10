import { WIN, ANIMATE } from '../constants';
import { IS_FUNC } from '../utils';
import { TimelineMax } from 'gsap';

const STAGGER = ( props ) => {
  let tl = new TimelineMax();
  tl.staggerTo( props.elements, props.duration || 0.6, {
    y: props.y || 0,
    x: props.x || 0,
    opacity: props.opacity || 1,
    ease: (IS_FUNC(props.ease)) ? props.ease : eval(props.ease) || Power2.easeOut
  }, props.delay || 0.25 )
    .eventCallback('onStart', () => {
      if (!IS_FUNC(props.onStart)) return;
      props.onStart(tl);
    }, null)
    .eventCallback('onComplete', () => {
      if (!IS_FUNC(props.onComplete)) return;
      props.onComplete(tl);
    }, null);
};
const STAGGERGROUPS = (props) => {
  const groups = $(props.parent).find('[data-anim-group]');
  var groupsTL = new TimelineMax();
  groups.each( (i, item) => {
    let container = $(item);
    let delay = container.data('anim-group') || 0;
    if (!IS_FUNC(props.callback)) return;
    groupsTL.add(() => props.callback(container), delay);
  } );
};

export default class SCROLLTRIGGER {
  constructor(prop) {
    this._container = prop.container || $('[data-scroll-trigger]');
    this._onStart = prop.onStart;
    this._offset = prop.offset;
    this._init();
  }

  _init() {
    this._container.each((id, el) => {
      const item = $(el);
      const itemData = item.data('scroll-trigger');
      let itemOffset;
      itemData === 0
        ? (itemOffset = 0)
        : (itemOffset = itemData || this._offset || 50);
      const show = () => {
        const thisOffset = item.offset().top + itemOffset;
        const windowOffset = WIN.scrollTop() + WIN.outerHeight();

        if (thisOffset <= windowOffset) {
          WIN.off('scroll', show);

          if (IS_FUNC(this._onStart)) this._onStart(item);

          if (item.hasClass(ANIMATE)) return;
          item.addClass(ANIMATE);
        }
      };

      show();
      WIN.on('scroll', show);
    });
  }
}
export const staggerAnimation = item => {
  let selector;
  if (item.attr('data-group-inner')) {
    selector = item.find('[data-anim-inner]');
  } else {
    selector = item.find('[data-anim]');
  }
  const animDelay = item.data('delay-anim');
  const animDuration = item.data('duration-anim');
  const animEase = item.data('ease-anim');
  const animContainers = item.find('[data-anim]');
  STAGGER({
    elements: selector,
    duration: animDuration,
    delay: animDelay,
    ease: animEase
  });
};
setTimeout(() => {
  new SCROLLTRIGGER({
    onStart: item => {
      const group = item.find('[data-anim-group]');
      if (!group.length) {
        staggerAnimation(item);
      } else {
        // init animation groups stagger
        STAGGERGROUPS({
          callback: container => {
            staggerAnimation(container);
          },
          parent: item
        });
      }
    }
  });
}, 300);
