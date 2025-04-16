import { useEffect } from "react";
import { useParams } from "react-router-dom";

export function useRestauranteId(): string | null {
  const { restauranteId } = useParams<{ restauranteId: string }>();

  useEffect(() => {
    if (restauranteId) {
      localStorage.setItem("restauranteId", restauranteId);
    }
  }, [restauranteId]);

  return restauranteId || localStorage.getItem("restauranteId");
}
