Install npm and git
Install chrome extension https://fb.me/react-devtools

To install React Bindings

npm install typings --global

typings install dt~react --global --save 1

Extensions:
Express
react snippets

JSFiddle
https://jsfiddle.net/reactjs/69z2wepo/

Some code samples taken from 
https://www.meteor.com/tutorials/react/components
https://jsfiddle.net/reactjs/69z2wepo/

Bring up Command Palette (F1, or Ctrl+Shift+P on Windows and Linux, or Shift+CMD+P on OSX)
Type or select "Express: Host current workspace and open in browser"

index.1.html > sample of a page with Submit button disabled and selectable upon radio button select (using initial state)
also with mixin for ComponentVisibilityMixin to check if the scroll was into view

Waiting placeholder - https://matthewroach.github.io/react-placeholder/

Sample WW code, there must be a script with priority 0    
<div id="root">
        <!-- this portion is managed by react -->
    </div>
<script type="text/javascript" src="/SiteAssets/pnp-ww.js"
          ww-appname="HelloWorld"
          ww-appscripts=
            '[{"src": "https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.js", "priority":0},
              {"src": "https://unpkg.com/react@15/dist/react.js", "priority":1},
              {"src": "https://unpkg.com/react-dom@15/dist/react-dom.js", "priority":1},
              {"src": "/siteassets/fetch.js", "priority":1},                           
              {"src": "/siteassets/test.js", "priority":2}             
             ]'>
  </script></div>

          
https://blogs.msdn.microsoft.com/mvpawardprogram/2013/11/25/using-sharepoint-propertybag-in-the-context-of-search/
To allow for propertybags to be indexed
$spweb.AllProperties["xx"] = "xx"        
$spweb.includeindexproperty.add("xx")
$spweb.Update

hide a splist column
http://stackoverflow.com/questions/290322/sharepoint-make-a-list-field-hidden-programmatically
SPList myList;
...
SPField titleField = myList.Fields.GetField("Title");
field.Hidden = true;
field.Update();

LODASH
https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js

Excel to JSON converter
https://shancarter.github.io/mr-data-converter/