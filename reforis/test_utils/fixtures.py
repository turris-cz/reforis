#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.


import pytest
from flask import Flask, jsonify
from flask_babel import Babel
from unittest import mock

from reforis import create_app
from reforis.utils import APIError
from reforis.test_utils.mocked_send import get_mocked_send


@pytest.fixture(scope="module")
def app_with_blueprint():
    def error_handler(error):
        return jsonify(error.data), error.status_code

    def app_factory(blueprint):
        app = Flask(__name__)
        app.register_blueprint(blueprint)
        app.register_error_handler(APIError, error_handler)
        app.backend = None
        Babel(app)
        return app

    return app_factory


@pytest.fixture
def client():
    """
    Flask's client to make requests. For example:

    .. code-block:: python

        def test_foo(client):
            res = client.get('/api/foo')
            assert res.status_code == 200
            assert res.json == {...}
    """
    app = _stubbed_app()
    with app.test_client() as client:
        with client.session_transaction() as session:
            session["logged"] = True
        with app.app_context():
            yield client


@pytest.fixture
def request_ctx():
    """
    Use this fixture when you call functions directly but they need request
    context like access to logged user, language and so on.
    """
    app = _stubbed_app()

    with app.test_request_context("/"):
        app.preprocess_request()
        yield


@mock.patch("foris_client.buses.mqtt.MqttSender")
@mock.patch("reforis.backend.MQTTBackend._parse_credentials", mock.Mock)
def _stubbed_app(sender_mock):
    sender_mock.return_value.send.side_effect = get_mocked_send()
    # The foris client may not existed on the testing environment
    # so we surrogate this module to avoid ImportError during testing.
    return create_app("test")
