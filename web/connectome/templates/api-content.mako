<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="${h.static('css/bootstrap.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/bootstrap-theme.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/jquery.modal.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/home.css')}" type="text/css">
        <!-- End Piwik Code -->
    </head>
    <body>
        <h1>api --help</h1>
        <section>
            <h3>List injections</h3>
            <div class="description"><i>Lists all injections we published.</i></div>
            <div class="parameters">
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
                        <tr>
                            <td>injection_id</td>
                            <td>String</td>
                            <td>Unique identifier fof the injection in system.</td>
                        </tr>
                        <tr>
                            <td>injection_region</td>
                            <td>String</td>
                            <td>The target region of the injection.</td>
                        </tr>
                        <tr>
                            <td>section</td>
                            <td>String</td>
                            <td>The section which the injection site is at.</td>
                        </tr>
                        <tr>
                            <td>tracer</td>
                            <td>String</td>
                            <td>The tracer used in this injection</td>
                        </tr>
                        <tr>
                            <td>a</td>
                            <td>Float</td>
                            <td>The Atlas AP Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                        <tr>
                            <td>l</td>
                            <td>Float</td>
                            <td>The Atlas ML Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                        <tr>
                            <td>h</td>
                            <td>Float</td>
                            <td>The Atlas DV Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                    </tbody>
            </div>
            Example link <a href="http://marmoset.braincircuits.org/api/v1/injections">http://marmoset.braincircuits.org/api/v1/injections</a>
        </section>
        <section>
            <h3>List Area FLNe Values</h3>
            <div class="description"><i>Lists area FLNe values</i></div>
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
                        <tr>
                            <td>format</td>
                            <td>Specify the return format of the result, possible values <i>JSON</i>, <i>CSV</i></td>
                        </tr>
                        <tr>
                            <td>area_code</td>
                            <td>Narrow down the result into interested area, possible values 
                                %for area in areas:
                                    <i>${area.code}</i>,
                                %endfor 
                            </td>
                        </tr>
                    </tbody>
            </div>
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
                        <tr>
                            <td>injection_id</td>
                            <td>String</td>
                            <td>Unique identifier fof the injection in system.</td>
                        </tr>
                        <tr>
                            <td>injection_region</td>
                            <td>String</td>
                            <td>The target region of the injection.</td>
                        </tr>
                        <tr>
                            <td>section</td>
                            <td>String</td>
                            <td>The section which the injection site is at.</td>
                        </tr>
                        <tr>
                            <td>tracer</td>
                            <td>String</td>
                            <td>The tracer used in this injection</td>
                        </tr>
                        <tr>
                            <td>a</td>
                            <td>Float</td>
                            <td>The Atlas AP Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                        <tr>
                            <td>l</td>
                            <td>Float</td>
                            <td>The Atlas ML Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                        <tr>
                            <td>h</td>
                            <td>Float</td>
                            <td>The Atlas DV Coordinate of the injection (Refer to Section X for description)
                            </td>
                        </tr>
                    </tbody>
            </div>
            Example link <a href="http://marmoset.braincircuits.org/api/v1/injections">http://marmoset.braincircuits.org/api/v1/injections</a>
        </section>


    </body>
</html>
