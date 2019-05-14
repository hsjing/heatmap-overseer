{
    "targets": [{
        "target_name": "renderer",
        "sources": ["srcpp/map.cc"],
        "include_dirs": ["<!(node -e \"require('nan')\")"]
    }]
}