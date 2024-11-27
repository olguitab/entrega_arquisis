import httpx
from collections import Counter
from celery import shared_task
import asyncio
import redis
import json

# Conexión a Redis (suponiendo que Redis esté en ejecución en localhost:6379)
cache = redis.StrictRedis(host='redis-broker', port=6379, db=0, decode_responses=True)

async def get_user_bets(user_id):
    async with httpx.AsyncClient() as client:
        try:
            # Obtener el historial de apuestas del usuario
            response = await client.get(f"https://olguitabarriga.me/api/bet/history/{user_id}")
            response.raise_for_status()
            user_bets = response.json()
            print(f"User Bets Response: {user_bets}")

            # Filtrar las apuestas con un "result" diferente a "---"
            valid_bets = [bet for bet in user_bets if bet["result"] != "---"]

            # Extraer los nombres de los equipos apostados y contar las repeticiones
            team_names = [bet["league_name"] for bet in valid_bets]  # Ajustar campo según el nombre del equipo
            team_counts = Counter(team_names)
            
            # Ordenar equipos por frecuencia
            ordered_teams = [team for team, count in team_counts.most_common()]
            print(f"Ordered Teams by Frequency: {ordered_teams}")

            return ordered_teams
        except httpx.HTTPStatusError as e:
            print(f"Error al obtener apuestas del usuario: {e}")
            return []
        except Exception as e:
            print(f"Error inesperado: {e}")
            return []

async def get_upcoming_matches():
    async with httpx.AsyncClient() as client:
        try:
            # Obtener todos los próximos partidos
            response = await client.get("https://olguitabarriga.me/fixtures")
            response.raise_for_status()
            matches = response.json().get('data', [])
            print(f"All Upcoming Matches: {matches}")
            return matches
        except httpx.HTTPStatusError as e:
            print(f"Error al obtener todos los próximos partidos: {e}")
            return []
        except Exception as e:
            print(f"Error inesperado: {e}")
            return []

async def find_top_recommended_matches(teams):
    all_matches = await get_upcoming_matches()
    recommended_matches = []

    # Filtrar los partidos donde participan los equipos en `teams`
    for team in teams:
        for match in all_matches:
            home_team = match['teams']['home']['name']
            away_team = match['teams']['away']['name']

            if team in (home_team, away_team):
                # Seleccionar el equipo como ganador según el equipo favorito del usuario
                recommended_winner = team
                match_info = {
                    "fixture_id": match["fixture"]["id"],
                    "fixture_data": match,
                    "recommended_winner": recommended_winner
                }
                recommended_matches.append(match_info)
                print(f"Found Match for Team {team}: {match_info}")

            if len(recommended_matches) >= 3:
                return recommended_matches

    # Si no hay suficientes coincidencias, agregar los primeros partidos disponibles con equipo local como ganador
    if len(recommended_matches) < 3:
        additional_matches_needed = 3 - len(recommended_matches)
        for match in all_matches:
            if match not in [rm["fixture_data"] for rm in recommended_matches]:
                home_team = match['teams']['home']['name']
                match_info = {
                    "fixture_id": match["fixture"]["id"],
                    "fixture_data": match,
                    "recommended_winner": home_team
                }
                recommended_matches.append(match_info)
                if len(recommended_matches) >= 3:
                    break

    return recommended_matches

async def generate_recommendations(user_id):
    # Primero, revisamos si ya hay recomendaciones guardadas en cache (Redis)
    cached_recommendations = cache.get(f"user_recommendations_{user_id}")
    if cached_recommendations:
        print(f"Using cached recommendations for user {user_id}")
        return json.loads(cached_recommendations)

    # 1. Obtener y ordenar las apuestas históricas del usuario
    teams = await get_user_bets(user_id)

    # 2. Buscar los próximos partidos recomendados para estos equipos
    recommendations = await find_top_recommended_matches(teams)

    # Almacenar las recomendaciones en Redis (caché) por un tiempo determinado (ej. 24 horas)
    cache.setex(f"user_recommendations_{user_id}", 86400, json.dumps(recommendations))

    print(f"Recommendations: {recommendations}")
    return recommendations


