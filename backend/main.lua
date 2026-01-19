local logger = require("logger")
local millennium = require("millennium")
local http = require("http")
local json = require("json")

local DEFAULT_HEADERS = {
    ["Accept"] = "application/json,text/html",
    ["X-Requested-With"] = "Steam",
    ["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36"
}

local function Request(url, headers)
    local options = {
        headers = headers or DEFAULT_HEADERS,
        timeout = 20
    }

    local response, err = http.get(url, options)

    if not response then
        return json.encode({
            success = false,
            error = err or "No response"
        })
    end

    if response.status ~= 200 then
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

function ScrapeAchievementDetails(appId)
    local url = string.format("https://steamhunters.com/apps/%s/achievements", appId)

    local html = Request(url)
    if not html or html:find('{"success":false') then
        return html
    end

    -- Find the start of the 'sh' object
    local start_index = html:find("sh%s*=%s*{")
    if not start_index then
        logger:error("Could not find 'sh' object in HTML for appId " .. appId)
        return json.encode({ success = false, error = "Could not find 'sh' data object" })
    end

    local first_brace = html:find("{", start_index)
    local sh_text = html:match("%b{}", first_brace)
    if not sh_text then
        logger:error("Could not find balanced 'sh' object for appId " .. appId)
        return json.encode({ success = false, error = "Could not find balanced 'sh' object" })
    end

    -- Extract 'model' part
    local model_start = sh_text:find("model%s*:%s*{")
    if not model_start then
        logger:error("Could not find 'model' in 'sh' object for appId " .. appId)
        return json.encode({ success = false, error = "Could not find 'model' in 'sh' object" })
    end

    local model_text = sh_text:match("%b{}", model_start)
    if not model_text then
        logger:error("Could not find balanced 'model' object for appId " .. appId)
        return json.encode({ success = false, error = "Could not find balanced 'model' object" })
    end

    return json.encode({
        success = true,
        modelText = model_text
    })
end

function on_load()
    millennium.ready()
end

return {
    on_load = on_load
}
