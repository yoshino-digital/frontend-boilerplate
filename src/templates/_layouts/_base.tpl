{% set base = "/" %}

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>A Yoi Project</title>
        <link href="{{ base }}assets/css/screen.css" rel="stylesheet" />
        <link href="{{ base }}favicon.ico" rel="shortcut icon" type="image/x-icon" />
        {% block customStyles %}{% endblock %}
    </head>
    <body class="noJs" yoi-environment="desktop">
        <script>document.body.className='js';</script>
        {% block main %}{% endblock %}
        <script src="{{ base }}assets/js/jquery.min.js"></script>
        <script src="{{ base }}assets/js/scripts.js"></script>
        {% block customScripts %}{% endblock %}
    </body>
</html>
