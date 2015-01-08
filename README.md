MyHealth Auto-Login
=============

Auto-login for MyHealth Monitoring

Installation
-------------

-  Check out this repo
-  Install grunt and bower (if you haven't already): ```npm install -g grunt bower```
-  run ```npm install; bower install```
-  ???
-  Profit

How to make the things do the things
-------------

Direct your application to the following address to log in to QA-Slot2: ```localhost:3150/#app=qa2&redirect=true```

The app parameter can be changed to ```qa1, qa2, qa3, dev, local```

The ```redirect``` parameter will automatically grab a token and try to log in.  Otherwise, there is a single rendered button in which to click.
