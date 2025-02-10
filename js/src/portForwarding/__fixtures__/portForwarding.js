const portForwardingFixture = {
    rules: [
        {
            name: "Service",
            dest_ip: "192.168.2.101",
            dest_port: 8090,
            src_dport: 8090,
            enabled: true,
        },
    ],
};

export default portForwardingFixture;
