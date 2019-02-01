{  
	"targets": [
		{
			"target_name": "addon",
			"sources": [ 
				"srcpp/addon.cc",
				"srcpp/async_render.cc"
				],
			"include_dirs": [
				"<!(node -e \"require('nan')\")"
			]
		}
	]
}