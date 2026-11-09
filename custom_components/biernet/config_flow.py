"""Config flow for the Biernet integration."""

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import (
    DEFAULT_PERCENTAGE_MAX,
    DEFAULT_PERCENTAGE_MIN,
    DEFAULT_TOP_N,
    DEFAULT_UPDATE_HOURS,
    DOMAIN,
    SOORTEN,
    SORTERINGEN,
    VERPAKKINGEN,
    WINKELS,
)


def _labeled_options(mapping: dict[str, str], **kwargs: Any) -> selector.SelectSelector:
    return selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=[
                selector.SelectOptionDict(value=value, label=label)
                for value, label in mapping.items()
            ],
            **kwargs,
        )
    )


def _percentage_schema(
    data: dict[str, Any], include_name: bool
) -> dict[Any, selector.SelectSelector | selector.NumberSelector | Any]:
    schema: dict[Any, Any] = {}
    if include_name:
        schema[vol.Required("name")] = str
    schema.update(
        {
            vol.Optional("winkel", default=data.get("winkel", [])): _labeled_options(
                WINKELS,
                multiple=True,
                sort=True,
                mode=selector.SelectSelectorMode.DROPDOWN,
            ),
            vol.Optional("soort", default=data.get("soort", [])): _labeled_options(
                SOORTEN,
                multiple=True,
                sort=True,
                mode=selector.SelectSelectorMode.DROPDOWN,
            ),
            vol.Optional("verpakking", default=data.get("verpakking", [])): _labeled_options(
                VERPAKKINGEN,
                multiple=True,
                mode=selector.SelectSelectorMode.LIST,
            ),
            vol.Optional(
                "percentage_min", default=data.get("percentage_min", DEFAULT_PERCENTAGE_MIN)
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0,
                    max=20,
                    step=1,
                    mode=selector.NumberSelectorMode.SLIDER,
                )
            ),
            vol.Optional(
                "percentage_max", default=data.get("percentage_max", DEFAULT_PERCENTAGE_MAX)
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0,
                    max=20,
                    step=1,
                    mode=selector.NumberSelectorMode.SLIDER,
                )
            ),
            vol.Optional(
                "sorteer", default=data.get("sorteer", "literprijs-oplopend")
            ): _labeled_options(SORTERINGEN, mode=selector.SelectSelectorMode.DROPDOWN),
            vol.Optional("top_n", default=data.get("top_n", DEFAULT_TOP_N)): selector.NumberSelector(
                selector.NumberSelectorConfig(min=1, max=100, step=1)
            ),
            vol.Optional(
                "update_hours", default=data.get("update_hours", DEFAULT_UPDATE_HOURS)
            ): selector.NumberSelector(selector.NumberSelectorConfig(min=1, max=168, step=1)),
        }
    )
    return schema


class BiernetConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the Biernet config flow."""

    VERSION = 2

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if user_input is not None:
            await self.async_set_unique_id(user_input["name"].lower())
            self._abort_if_unique_id_configured()
            return self.async_create_entry(title=user_input["name"], data=user_input)

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(_percentage_schema({}, include_name=True)),
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> BiernetOptionsFlow:
        return BiernetOptionsFlow(config_entry)


class BiernetOptionsFlow(config_entries.OptionsFlow):
    """Allow changing the filters of an existing search."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self.config_entry = config_entry

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        data = {**self.config_entry.data, **self.config_entry.options}
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(_percentage_schema(data, include_name=False)),
        )
