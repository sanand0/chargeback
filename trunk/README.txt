Install on LIV10SFM01V
    1. Install  Java Runtine Environment (JRE 1.5 or above).
       I'll assume it's at C:\JRE
    2. Unzip persevere.zip. I'll assume it's at D:\CHARGEBACK\PERSEVERE.
    3. Unzip chargeback.zip. I'll assume it's at D:\CHARGEBACK\CHARGEBACK.

Run
    Edit the last two lines in CHARGEBACK.BAT to reflect the paths. E.g.:
        SET JAVA_HOME=C:\JRE
        D:\CHARGEBACK\PERSEVERE\BIN\PERSVR.BAT -p 82 -r D:\CHARGEBACK\CHARGEBACK
    Run D:\CHARGEBACK\CHARGEBACK\CHARGEBACK.BAT. Visit localhost:82 to test.
    Go to Start - Control Panel - Scheduled Tasks and add a new task.
    Select CHARGEBACK.BAT as the file to run.
    Select D:\CHARGEBACK\CHARGEBACK as the "Start in" folder (change as required).
    Select the user to run as. (The user must have Administrator access.)
    Ensure that "Run only if logged in" is NOT ticked.
    Ensure that the task will not be stopped after a certain number of hours.
    In the Schedule tab, change the schedule to "At System Startup".
    Right-click on the task and run it.

Backup and restore
    To backup, take a copy of the D:\CHARGEBACK\CHARGEBACK folder.
    To restore, replace the copy of the D:\CHARGEBACK\CHARGEBACK folder.

Application overview
    The code is mostly client-side javascript, and is in:
        view.html               shows all the records
        form.html               creates or edits a record
        upload.html             uploads order reference data
        template.html           templates for covering letters to banks
        common.js               standard libraries -- jQuery + plugins
        chargeback.js           chargebacks-specific code

    All the colours, layouts, fonts, etc. are in:
        chargeback.css          Cascading Style Sheet for the application
        *.gif, *.png            Various images used in the application

    All the server side code is in:
        WEB-INF/jslib/Chargebacks.js  Stores data in a flat file
        WEB-INF/jslib/CSV.js          Exports data as CSV

How does this interact with the Fraud Scorecard?
    It doesn't. It's completely independent of the Fraud Scorecard...

How to stop the application?
    Visit http://chargeback.ukroi.tesco.org/shutdown-chargeback
    WARNING: This will immediately shut down the application!
