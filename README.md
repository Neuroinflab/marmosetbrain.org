[Marmoset Brain Connectivity Atlas](http://www.marmosetbrain.org)
=========================================================

The marmoset brain connectivity atlas's immediate aim is to create a systematic, publicly available digital repository for data on the connections between different cortical areas, in a primate species.

This initial stage takes advantage of a large collection of materials obtained over two decades of research, using fluorescent retrograde tracer injections in adult marmosets (*Callithrix jacchus*). Whereas several research papers have already stemmed from this material (e.g. Rosa et al. 2009; Burman et al. 2011; Reser et al. 2013; Burman et al. 2014, 2015; Majka et al. 2019), the present project represents a new initiative, towards collating these data and making them publicly available, in their entirety.

We believe that sharing these materials via a digital interface will address many of the current limitations of the traditional media used for communication of neuroanatomical research, including allowing access to the entire data set (as opposed to the few sections typically illustrated in journal articles), and enabling other interpretations of the data, in light of the future evolution of knowledge about the marmoset cortex.

Among other positive consequences, we hope that the availability of raw data, which can be analysed independently in different contexts, will reduce the number of animals that need to be used for research on the organization of the primate nervous systems. See the [technical whitepaper for more details](http://www.marmosetbrain.org/whitepaper).

Installation
------------
The building programming language of Marmoset Brain Connectivity Atlas is Python with NumPy and several other Open Source Software. The only operating system supported is Linux, though there was success deploying the project on MacOS.

There are 3 major components. 

## /web

The Web framework, developed based on [Pyramid](https://trypyramid.com/) with client Javascript code compiled by nodesass, webpack and other utility tools.

## /rosaj2k

Another Python WSGI application, used to decode the JPEG2000 encoded images separately. This server is very CPU and RAM hungry and is intended to run separately from the main web application

## /rosatiff

A convenient Python module (Cython based) wrapper to work together with [Kakadu JPEG2000 decoder](http://kakadusoftware.com/) and [OpenJPEG](https://www.openjpeg.org/). There is particular handling of utility code to handle Aperio Image Scanner's propritary format .sws file.

## other requirement and dependencies

The main web application uses [PostgreSQL](https://www.postgresql.org/). Though it is entirely possible to run MySQL / MariaDB instead, some feature may not working perfectly due to the some database dialect used.

Database schema files are provided in the repository.

The image decoding application expect to run with RabbitMQ as Celery backend with local guest account enabled. A working MongoDB local installation is expected as well.

To build the tiff dlibrary, type from source tree directory:
```
python setup.py build_ext
pip install -e .
```

Then the rosatiff module is available to be invoked from JPEG2000 server.

To setup and run the image server
```
cd rosaj2k
pip install -e .
uwsgi --ini-paste development.ini
celery worker -A pyramid_celery.celery_app --ini development.ini --loglevel=DEBUG&
```

To setup and run the main web server
```
cd web
cd connectome
cd react
npm install

cd ..
pip install -e .
uwsgi --ini-paste development.ini

npm run webpack&
npm run grunt&
```

The software expect to run under non-privileged user.

Note: Some libraries needed indirectly by the software stack may need to be installed. A general working command for Ubuntu or Debian based Linux is as follows:

```
sudo apt-get install libpython-dev libpy-dev python-virtualenv python2.7-dev python-pip libopenjpeg-dev mongodb postgresql-server nginx nodejs
```

Licensing and Citation Policy
-----------------------------
This source code is distributed under the term of [GNU AFFERO GENERAL PUBLIC LICENSE Version 3](https://www.gnu.org/licenses/agpl-3.0.en.htm).
Click [here](http://www.marmosetbrain.org/about) for citation policy page.

Authors
-------
Click [here](http://www.marmosetbrain.org/about#contributors) for a detailed list of Authors and Contributors of the project.

Sponsors
--------

[![International Neuroinformatics Coordinating Facility Seed Funding Grant](http://www.marmosetbrain.org/static/images/incf_logo.svg)](https://www.incf.org/)
[![Australian Research Council](http://www.marmosetbrain.org/static/images/arc_logo.png)](http://www.arc.gov.au/)
[![Centre of Excellence for Integrative Brain Function](http://www.marmosetbrain.org/static/images/cibf_logo.png)](http://www.cibf.edu.au/discovery)

[![Nencki Insitute of Experimental Biology](http://www.marmosetbrain.org/static/images/nencki_logo.png)](http://en.nencki.gov.pl/laboratory-of-neuroinformatics)
[![Monash University](http://www.marmosetbrain.org/static/images/monash_logo.png)](http://www.monash.edu.au/)
