import svg4everybody from 'svg4everybody';
import './common';
import { BODY, NO_TOUCH, LOADED } from './constants';
import { isTouch } from './utils';
svg4everybody();


BODY.addClass(LOADED);
if (!isTouch()) BODY.addClass(NO_TOUCH);
