const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
                            ( typeof window.performance != "undefined" && 
                                window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
        window.location.reload();
    }
});