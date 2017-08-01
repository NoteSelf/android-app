
import tw from './tw';
import Tpouch from './NS/tpouch'
import NS from './NS/index'
window.$tw = tw;

document.addEventListener('deviceready', () =>
    Tpouch()
    .then(
        () => NS(tw).initialize()
    )
    .then( 
        $NS => { 
            window.$NS = $NS;
        }
    )
    , false);