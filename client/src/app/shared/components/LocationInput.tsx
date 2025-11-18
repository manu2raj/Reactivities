import { type FieldValues, type UseControllerProps, useController } from "react-hook-form"
import type { LocationIQSuggestion } from "../../../lib/types";
import { useEffect, useMemo, useState } from "react";
import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material";
import axios from "axios";

type Props<T extends FieldValues> = {
  label: string
} & UseControllerProps<T> 

export default function LocationInput<T extends FieldValues>(props : Props<T>) {
    const {field, fieldState} = useController({...props});
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    // Check which data need to show in textbox. If contains object, then show venue else field value or empty string
    useEffect(() => {
        if (field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '');
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value])

    const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.8335037c5b3042bfc1ffbaee29c125a0&limit=5&dedupe=1&'
    // set limit = 5
    // set dedupe= 1, to avoide duplicate response
    // https://my.locationiq.com/dashboard#accesstoken  got key from this url account 2020sc04831

    /// Get suggesstion based on use input from API
    const fetchSuggestions = useMemo(
      () => debounce(async (query: string) => {     // debounce : it is call back function. we have to wait atleast 3 input char from user 
        if (!query || query.length < 3) {
          setSuggestions([]);
          return;
        }
          
        setLoading(true);

        try {          
          const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`)
          setSuggestions(res.data);
        } catch (error) {
          console.log(error);
        }
        finally {
          setLoading(false);
        }
      }, 500), [locationUrl]          
    )

    // raised when user provide value in control. It will call fetchSuggestion
    const handleChange = async (value: string) => {
        field.onChange(value);
        await fetchSuggestions(value);
    }

    // If user select any suggestion from list
    const handleSelect = (location: LocationIQSuggestion) => {
        const city = location.address?.city || location.address?.town || location.address?.village;
        const venue = location.display_name;
        const latitude = location.lat;
        const longitude = location.lon;

        setInputValue(venue);
        field.onChange({city, venue, latitude, longitude});
        setSuggestions([]);
    }

  return (
    <Box>
      <TextField
        {...props}
        value={inputValue}
        onChange={e => handleChange(e.target.value)}
        fullWidth
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
        
      {loading && <Typography>Loading...</Typography>} {/** While getting data from api, show Loading... as message */}

      {/** If we get some suggestion, then show as list+ */}
      {suggestions.length > 0 && (
        <List sx={{border: 1}}>
            {suggestions.map(suggestion => (
                <ListItemButton
                    divider
                    key={suggestion.place_id}
                    onClick={() => handleSelect(suggestion)}
                >
                    {suggestion.display_name}
                </ListItemButton>
            ))}
        </List>
      )}
    </Box>
  )
}
