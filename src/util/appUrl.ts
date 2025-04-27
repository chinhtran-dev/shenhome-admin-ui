export const baseUrl = process.env.NEXT_PUBLIC_API_URL
export const Url = {
	'auth': {
		'login': '/Authorize/Admin/SignIn',
		'logout': '/Authorize/RevokeToken',
		'refreshToken': '/Authorize/RefreshToken'
	},
	'category': {
		'list': '/Categories/Search',
		'view': (id: string) => `/Categories/${id}`,
		'update': (id: string) => `/Categories/${id}`,
		'delete': (id: string) => `/Categories/${id}`,
		'create': '/Categories',
		'listSelect': '/Categories/ListSelect'
	},
	'deviceProfile': {
		'list': '/DeviceProfiles/Search',
		'view': (id: string) => `/DeviceProfiles/${id}`,
		'update': (id: string) => `/DeviceProfiles/${id}`,
		'delete': (id: string) => `/DeviceProfiles/${id}`,
		'create': '/DeviceProfiles',
		'listSelect': '/DeviceProfiles/ListSelect'
	},
	'devices': {
		'list': '/Devices/AdminSearch',
		'view': (id: string) => `/Devices/${id}/Admin`,
		'update': (id: string) => `/Devices/${id}/Admin`,
		'delete': (id: string) => `/Devices/${id}`,
		'create': '/Devices',
	}
}