<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>A YOI Project</title>
        <link href="/assets/css/screen.css" rel="stylesheet" />
        <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        {% block customStyles %}{% endblock %}
    </head>
    <body class="noJs" data-environment="desktop">
        <script>document.body.className='js';</script>
        {% block main %}{% endblock %}
        <script src="/assets/js/jquery.min.js"></script>
        <script src="/assets/js/scripts.js"></script>
        {% block customScripts %}{% endblock %}
    </body>
</html>
