<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="${h.static('css/bootstrap.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/bootstrap-theme.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/jquery.modal.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/home.css')}" type="text/css">
        <!-- End Piwik Code -->
    </head>
    <body class="api-help">
        <h1>api --help</h1>
        %for a in api:
            <section>
                <h3>${a['title'] | n}</h3>
                <div class="description"><i>${a['description']}</i></div>
                %if 'parameters' in a:
                    <div class="parameters">
                        <table>
                            <caption>Parameters</caption>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                %for param in a['parameters']:
                                <tr>
                                    <td>${param['param'] | n}</td>
                                    <td>${param['description'] | n}</td>
                                </tr>
                                %endfor
                            </tbody>
                        </table>
                    </div>
                %endif
                <div class="properties">
                    <table>
                        <caption>Properties</caption>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Data Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            %for prop in a['properties']:
                            <tr>
                                <td>${prop['property'] | n}</td>
                                <td>${prop['data_type'] | n}</td>
                                <td>${prop['description'] | n}</td>
                            </tr>
                            %endfor
                        </tbody>
                    </table>
                </div>
                %if isinstance(a['example'], list):
                    <div class="example-link">Example links:
                    %for ex in a['example']:
                        <div>
                            <a href="${ex}" target="_blank">${ex}</a>
                        </div>
                    %endfor
                    </div>
                %else:
                    <div class="example-link">Example link <a href="${a['example']}" target="_blank">${a['example']}</a></div>
                %endif
                %if 'example_response' in a:
                    <div class="example-response">Example response</div>
                    <div class="example-response">
                        <pre>${a['example_response'] | n}</pre>
                    </div>
                %endif
            </section>
        %endfor
        </section>
    </body>
</html>
