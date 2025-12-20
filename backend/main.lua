local logger = require("logger")
local millennium = require("millennium")
local http = require("http")
local json = require("json")

local DEFAULT_HEADERS = {
    ["Accept"] = "application/json",
    ["X-Requested-With"] = "Steam",
    ["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36"
}

local function Request(url)
    local options = {
        headers = DEFAULT_HEADERS,
        timeout = 20
    }

    local response, err = http.get(url, options)

    if not response then
        return json.encode({
            success = false,
            error = err or "No response"
        })
    end

    if response.status >= 400 then
        return json.encode({
            success = false,
            error = string.format("HTTP %s %s", response.status, response.body or "No response")
        })
    end

    return response.body
end

function RequestAchievementGroups(appId)
    return Request(string.format("https://steamhunters.com/api/GetAchievementGroups/v1?appid=%s", appId))
end

function RequestAchievements(appId)
    return Request(string.format("https://steamhunters.com/api/apps/%s/achievements", appId))
end

function RequestSteamGameInfo(appId)
    return Request(string.format("https://steamhunters.com/api/apps/%s", appId))
end

function on_load()
    millennium.ready()
end

return {
    on_load = on_load
}
