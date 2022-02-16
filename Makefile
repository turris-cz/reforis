#  Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

PROJECT="reForis"
# Retrieve reForis version from setup.py 
VERSION= $(shell sed -En "s/.*version=['\"](.+)['\"].*/\1/p" setup.py)
COPYRIGHT_HOLDER="CZ.NIC, z.s.p.o. (https://www.nic.cz/)"
MSGID_BUGS_ADDRESS="tech.support@turris.cz"

VENV_NAME?=venv
VENV_BIN=$(shell pwd)/$(VENV_NAME)/bin

PYTHON=python3

JS_DIR=./js

FLASK=flask
REFORIS_PORT ?= 81
REFORIS_WS_PORT ?= 9081
MQTT_PASSWORD_FILE ?= /etc/fosquitto/credentials.plain
MQTT_PORT ?= 11883

export FLASK_APP=reforis:create_app('dev')
export FLASK_ENV=development

REFORIS_STATIC_PATH := $(shell $(PYTHON) -c 'import site; print(site.getsitepackages()[0])')/reforis_static

.PHONY: all
all:
	@echo "make prepare-dev"
	@echo "    Create python virtual environment and install dependencies."
	@echo "make prepare-docs"
	@echo "    Install tools for building docs."
	@echo "make install"
	@echo "    Install package on router."
	@echo "make install-with-lighttpd"
	@echo "    Install package with lighttpd configuration and link /tmp/reforis to installed python packages for development."
	@echo "make run"
	@echo "    Run Flask server."
	@echo "make run-ws"
	@echo "    Run WebSocket server."
	@echo "make watch-js"
	@echo "    Compile JS in watch mode."
	@echo "make build-js"
	@echo "    Compile JS."
	@echo "make lint"
	@echo "    Run lint on project."
	@echo "make test"
	@echo "    Run tests on project."
	@echo "make create-messages"
	@echo "    Create locale messages (.pot)."
	@echo "make update-messages"
	@echo "    Update locale messages from .pot file."
	@echo "make compile-messages"
	@echo "    Compile locale messages."
	@echo "make docs"
	@echo "    Build documentation."
	@echo "make timezones"
	@echo "    Generate JS file with timezones."
	@echo "make clean"
	@echo "    Remove python artifacts and virtualenv."


# Preparation

.PHONY: prepare-dev
prepare-dev:
	which npm || curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
	which npm || sudo apt install -y nodejs
	cd $(JS_DIR); npm install

	which $(PYTHON) || sudo apt install -y $(PYTHON) $(PYTHON)-pip
	which virtualenv || sudo $(PYTHON) -m pip install virtualenv
	make venv

.PHONY: prepare-docs
prepare-docs:
	$(VENV_BIN)/$(PYTHON) -m pip install -e .[build]

.PHONY: venv
venv: $(VENV_NAME)/bin/activate
$(VENV_NAME)/bin/activate: setup.py
	test -d $(VENV_NAME) || $(PYTHON) -m virtualenv -p $(PYTHON) $(VENV_NAME)
	# Some problem in latest version of setuptools during extracting translations.
	$(VENV_BIN)/$(PYTHON) -m pip install -U pip setuptools==39.1.0
	$(VENV_BIN)/$(PYTHON) -m pip install -e .[devel]
	touch $(VENV_NAME)/bin/activate


# Installation

.PHONY: install
install: setup.py
	$(PYTHON) -m pip install -e .

.PHONY: install-with-lighttpd
install-with-lighttpd:
	opkg update
	opkg install git git-http
	opkg install reforis
	opkg install python3-pip
	pip3 uninstall reforis -y
	pip3 install -e .
	rm -rf $(REFORIS_STATIC_PATH)
	ln -sf /tmp/reforis/reforis_static $(REFORIS_STATIC_PATH)
	/etc/init.d/lighttpd restart

.PHONY: install-js
install-js: js/package.json
	cd $(JS_DIR); npm install --save-dev


# Flask

.PHONY: run
run:
	$(FLASK) run --host="0.0.0.0" --port=$(REFORIS_PORT)

.PHONY: run-ws
run-ws:
	foris-ws --host "0.0.0.0" --port $(REFORIS_WS_PORT) -a filesystem -d mqtt --mqtt-host localhost \
	--mqtt-port $(MQTT_PORT) --mqtt-passwd-file "$(MQTT_PASSWORD_FILE)";



# JavaScript

.PHONY: build-js
build-js:
	cd $(JS_DIR); npm run-script build

.PHONY: watch-js
watch-js:
	cd $(JS_DIR); npm run-script watch


# Linting

.PHONY: lint
lint: lint-js lint-web

.PHONY: lint-js
lint-js:
	cd $(JS_DIR); npm run lint

.PHONY: lint-js-fix
lint-js-fix:
	cd $(JS_DIR); npm run lint:fix

.PHONY: lint-web
lint-web: venv
	$(VENV_BIN)/$(PYTHON) -m pylint --rcfile=pylintrc reforis
	$(VENV_BIN)/$(PYTHON) -m pycodestyle --config=pycodestyle reforis


# Testing

.PHONY: test
test: test-js test-web

.PHONY: test-js
test-js:
	cd $(JS_DIR); npm test

.PHONY: test-js-watch
test-js-watch:
	cd $(JS_DIR); npm test -- --watch

.PHONY: test-js-update-snapshots
test-js-update-snapshots:
	cd $(JS_DIR); npm test -- -u

.PHONY: test-web
test-web: venv
	$(VENV_BIN)/$(PYTHON) -m pytest -vv tests


# Translations

.PHONY: create-messages
create-messages: venv
	$(VENV_BIN)/pybabel extract -F babel.cfg -o ./reforis/translations/messages.pot . --project=$(PROJECT) --version=$(VERSION) --copyright-holder=$(COPYRIGHT_HOLDER) --msgid-bugs-address=$(MSGID_BUGS_ADDRESS)

.PHONY: update-messages
update-messages: venv
	$(VENV_BIN)/pybabel update -i ./reforis/translations/messages.pot -d ./reforis/translations --update-header-comment

.PHONY: compile-messages
compile-messages: venv install-js
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations
	for file in js/node_modules/foris/translations/* ; do \
		file_name="$$(basename $$file)" ;\
		file_path="$${file_name}/LC_MESSAGES/forisjs.po" ;\
		cp "js/node_modules/foris/translations/$${file_path}" "reforis/translations/$${file_path}" ;\
	done
	$(VENV_BIN)/pybabel compile -f -d ./reforis/translations -D forisjs


# Documentation

.PHONY: docs
docs: docs-js docs-web

.PHONY: docs-js
docs-js:
	cd $(JS_DIR); npm run-script docs

docs: docs-web docs-js

.PHONY: docs-web
docs-web: venv
	rm -rf docs/build
	. $(VENV_BIN)/activate && cd docs; make html

# Other

.PHONY: timezones
timezones:
	$(VENV_BIN)/$(PYTHON) ./scripts/make_timezones.py $(JS_DIR)/src/utils/timezones.js


.PHONY: clean
clean:
	find . -name '*.pyc' -exec rm -f {} +
	rm -rf $(VENV_NAME) *.eggs *.egg-info dist build docs/_build .cache
	rm -rf $(JS_DIR)/node_modules/ reforis_static/reforis/js/app.min.js reforis_static/reforis/css/app.css
	$(PYTHON) -m pip uninstall -y reforis
